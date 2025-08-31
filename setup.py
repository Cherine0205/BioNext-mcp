from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="bionext-mcp",
    version="2.2.1",
    author="BioNext Team",
    author_email="team@bionext.ai",
    description="🧬 生物信息学MCP服务器 - 专为ModelScope设计的智能生物数据分析工具",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/Cherine0205/BioNext-mcp",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Scientific/Engineering :: Bio-Informatics",
        "Topic :: Scientific/Engineering :: Information Analysis",
        "Topic :: Software Development :: Libraries :: Python Modules"
    ],
    python_requires=">=3.8",
    install_requires=requirements,
    entry_points={
        "console_scripts": [
            "bionext-mcp=bionext_mcp:main",
        ],
    },
    keywords="mcp, bioinformatics, python, modelscope, single-cell, genomics, proteomics, MCP&Agent挑战赛",
    project_urls={
        "Bug Tracker": "https://github.com/Cherine0205/BioNext-mcp/issues",
        "Documentation": "https://github.com/Cherine0205/BioNext-mcp#readme",
        "Source Code": "https://github.com/Cherine0205/BioNext-mcp",
    },
)
