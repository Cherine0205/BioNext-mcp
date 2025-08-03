print("=== BioNext MCP Test ===")
print("Python execution test")

import pandas as pd
import sys

print(f"Python version: {sys.version}")
print("Testing pandas...")

data = pd.DataFrame({
    'gene': ['GENE1', 'GENE2'],
    'expression': [10.5, 20.3]
})
print(data)
print("=== Test completed ===")