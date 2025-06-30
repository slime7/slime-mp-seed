from fontTools import subset
import os
import base64

def subset_material_symbols():
    """
    对 Material Symbols 字体进行子集化，保留可变特性和连字。
    所有参数均在函数内部定义。
    """

    # --- 可配置参数 ---
    # material symbols 全量字体文件
    INPUT_FONT_PATH = "material-symbols.woff2"
    OUTPUT_FONT_PATH = "material-symbols-subset.woff2"
    OUTPUT_BASE64_PATH = "base64.txt"

    # 需要保留的 Unicode 字符列表，例如 ['U+e5cd', 'U+f1c7', 'U+e88a']
    # 请根据你的需求修改这个列表
    UNICODES_TO_KEEP = [
        'U+d',
        'U+20', # space
        'U+a0', 'U+2e',
        'U+41', 'U+61', 'U+42', 'U+62', 'U+43', 'U+63', 'U+44', 'U+64', 'U+45', 'U+65',
        'U+46', 'U+66', 'U+47', 'U+67', 'U+48', 'U+68', 'U+49', 'U+69', 'U+5a', 'U+7a',
        'U+4b', 'U+6b', 'U+4c', 'U+6c', 'U+4d', 'U+6d', 'U+4e', 'U+6e', 'U+4f', 'U+6f',
        'U+50', 'U+70', 'U+51', 'U+71', 'U+52', 'U+72', 'U+53', 'U+73', 'U+54', 'U+74',
        'U+55', 'U+75', 'U+56', 'U+76', 'U+57', 'U+77', 'U+58', 'U+78', 'U+59', 'U+79',
        'U+5a', 'U+7a', 'U+5f', 'U+30', 'U+31', 'U+32', 'U+33', 'U+34', 'U+35', 'U+36',
        'U+37', 'U+38', 'U+39',
        'U+e5cd', # close
        'U+e000', # error
        'U+e88a', # home
        'U+e8ff', # zoom_in
        'U+e0c8', # location_on
        'U+e5c4', # arrow_back
        'U+e2ea', # arrow_back_ios_new
        'U+e15b', # remove
        'U+e145', # add
        'U+e147', # add_circle
        'U+e5ca', # check
        'U+e5cc', # chevron_right
        'U+ebcc', # calendar_month
        'U+e5c9', # cancel
    ]
    # --- 参数配置结束 ---

    # 验证输入文件是否存在
    if not os.path.exists(INPUT_FONT_PATH):
        print(f"错误：输入文件 '{INPUT_FONT_PATH}' 不存在。请确保它在同一目录下。")
        return

    print(f"开始子集化字体：{INPUT_FONT_PATH}")
    print(f"将保留的 Unicode 字符：{UNICODES_TO_KEEP}")
    print(f"输出文件：{OUTPUT_FONT_PATH}")

    # 构建 subset 命令行参数列表
    # fontTools subset 工具会根据传入的 --unicodes 参数来决定保留哪些字形，
    # 并默认删除其他未被引用的字形。
    # --layout-features='*' 会确保连字等布局功能被保留。
    # 对于可变字体，fontTools 会智能地保留 fvar, avar, gvar, cvar 等必要表，
    # 只要它们在子集化过程中仍然是必要的。
    args = [
        INPUT_FONT_PATH,
        f"--output-file={OUTPUT_FONT_PATH}",
        f"--unicodes={','.join(UNICODES_TO_KEEP)}",
        "--layout-features=*", # 保留所有布局特性，包括连字
        "--flavor=woff2",      # 输出 WOFF2 格式
        "--no-layout-closure",
        "--passthrough-tables=fvar,gvar,avar,STAT",
        # --no-hinting / --hinting: 根据你的需求决定是否移除 hinting。
        # 如果追求最小文件大小，可以考虑移除：--no-hinting
        "--hinting",
    ]

    try:
        subset.main(args)
        print("字体子集化完成！")

        output_size_bytes = os.path.getsize(OUTPUT_FONT_PATH)
        print(f"输出字体文件大小：{output_size_bytes / 1024:.2f} KB")

    except Exception as e:
        print(f"子集化过程中发生错误: {e}")

    try:
        with open(OUTPUT_FONT_PATH, "rb") as font_file:
            binary_data = font_file.read()
            base64_data = base64.b64encode(binary_data)
            # 将字节串转换为 UTF-8 字符串
            base64_string = "data:font/woff2;charset=utf-8;base64," + base64_data.decode('utf-8')

        with open(OUTPUT_BASE64_PATH, "w", encoding="utf-8") as output_file:
            output_file.write(base64_string)
    except Exception as e:
        print(f"转换过程中发生错误: {e}")
        return None

if __name__ == '__main__':
    subset_material_symbols()
