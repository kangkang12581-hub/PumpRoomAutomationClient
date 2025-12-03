#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
拆分OperationModule.vue脚本
将数据显示部分和按钮控制部分分离到不同组件
"""

import re
import os

def split_operation_module():
    """拆分OperationModule.vue文件"""
    
    # 读取原始文件
    file_path = 'src/components/modules/OperationModule.vue'
    backup_path = file_path + '.backup'
    
    # 如果备份文件存在，使用备份文件作为源
    if os.path.exists(backup_path):
        source_file = backup_path
    else:
        source_file = file_path
    
    with open(source_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 找到关键位置
    # 1. Template部分：系统操作控制模块开始位置
    data_display_template_end = content.find('<!-- 系统操作控制模块 -->')
    if data_display_template_end == -1:
        print("错误：找不到系统操作控制模块标记")
        return
    
    # 2. Script部分：找到return语句，确定需要返回的数据
    script_start = content.find('<script>')
    script_end = content.find('</script>', script_start)
    
    # 3. Style部分
    style_start = content.find('<style scoped>')
    style_end = content.find('</style>', style_start)
    
    print(f"文件结构：")
    print(f"  Template: 0 到 {data_display_template_end}")
    print(f"  Script: {script_start} 到 {script_end}")
    print(f"  Style: {style_start} 到 {style_end}")
    
    # 提取数据显示部分的template
    data_display_template = content[0:data_display_template_end].rstrip()
    
    # 提取系统操作控制部分的template（从系统操作控制模块开始到template结束）
    operation_template_start = data_display_template_end
    operation_template_end = content.find('</template>', operation_template_start)
    operation_template = content[operation_template_start:operation_template_end].rstrip()
    
    # 由于script和style需要更细致的拆分，我们先创建基础结构
    print("\n开始创建文件...")
    
    # 这里先创建一个简化版本，完整的拆分需要更多逻辑
    print("注意：这是一个初始拆分，需要手动调整script和style部分")

if __name__ == '__main__':
    split_operation_module()









