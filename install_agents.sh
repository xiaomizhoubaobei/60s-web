#!/bin/bash

# 定义颜色代码
PINK='\033[1;35m'
PURPLE='\033[0;35m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 错误计数器
error_count=0
total_agents=14

# 安装智能体函数
install_agent() {
    local agent_name=$1
    local display_name=$2
    
    echo -e "${PURPLE}正在安装 ${display_name}...${NC}"
    if iflow agent add "${agent_name}" --scope global; then
        echo -e "${PINK}${display_name} 安装完成${NC}"
    else
        echo -e "${RED}错误: ${display_name} 安装失败${NC}" >&2
        ((error_count++))
        return 1
    fi
}

# 安装typescript专家智能体
install_agent "typescript-pro" "typescript专家智能体"

# 安装教程编写专家智能体
install_agent "tutorial-engineer" "教程编写专家智能体"

# 安装文档架构师智能体
install_agent "docs-architect" "文档架构师智能体"

# 安装后端架构师智能体
install_agent "backend-architect" "后端架构师智能体"

# 安装代码审查专家智能体
install_agent "code-reviewer" "代码审查专家智能体"

# 安装安全审计专家智能体
install_agent "security-auditor" "安全审计专家智能体"

# 安装架构师审查专家智能体
install_agent "architect-reviewer" "架构师审查专家智能体"

# 安装API文档专家智能体
install_agent "api-documenter" "API文档专家智能体"

# 安装HTML编写专家智能体
install_agent "format_html_agent" "HTML编写专家智能体"

# 安装错误检测专家智能体
install_agent "error-detective" "错误检测专家智能体"

# 安装遗留代码专家智能体
install_agent "legacy-modernizer" "遗留代码专家智能体"

# 安装前端开发专家智能体
install_agent "frontend-developer" "前端开发专家智能体"

# 安装调试专家智能体
install_agent "debugger" "调试专家智能体"

# 安装性能专家智能体
install_agent "performance-engineer" "性能专家智能体"

# 总结
if [ $error_count -eq 0 ]; then
    echo -e "${PINK}所有智能体安装成功完成${NC}"
else
    echo -e "${RED}安装完成，但有 ${error_count}/${total_agents} 个智能体安装失败${NC}" >&2
    exit 1
fi