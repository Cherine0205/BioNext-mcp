"""
BioNext MCP Server - Intelligent Bioinformatics Analysis Assistant

This package provides a Model Context Protocol (MCP) server implementation for
automated bioinformatics analysis workflows.
"""

import argparse
from .my_server import mcp

__version__ = "2.2.2"
__author__ = "BioNext Team"

def main():
    """BioNext MCP Server: Intelligent Bioinformatics Analysis Assistant."""
    parser = argparse.ArgumentParser(
        description="BioNext MCP Server - 智能生物信息学分析助手，支持单细胞RNA测序、基因表达、基因组学、蛋白质组学等多种数据类型分析。"
    )
    parser.parse_args()
    mcp.run(transport="stdio")

if __name__ == "__main__":
    main()
