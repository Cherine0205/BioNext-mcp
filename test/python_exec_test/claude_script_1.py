import pandas as pd
import numpy as np
import sys
import os

print("=== BioNext MCP Python Execution Test ===")
print(f"Python version: {sys.version}")
print(f"Working directory: {os.getcwd()}")

# Test basic functionality
print("Testing basic calculations...")
result = 2 + 3
print(f"2 + 3 = {result}")

# Test pandas
print("Testing pandas...")
data = pd.DataFrame({
    'gene_id': ['GENE1', 'GENE2', 'GENE3'],
    'expression': [10.5, 20.3, 15.8]
})
print("Gene expression data:")
print(data)

print("=== Test completed successfully! ===")