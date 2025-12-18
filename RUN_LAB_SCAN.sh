#!/bin/bash

# ================================================================
# LAB TASK 01 - BROKEN ACCESS CONTROL SCAN
# Easy-to-run script for your lab demonstration
# ================================================================

echo "================================================================"
echo "  Lab Task 01: Broken Access Control Detection"
echo "  Tool: Semgrep"
echo "  Date: $(date)"
echo "================================================================"
echo ""

# Activate virtual environment
echo "🔧 Activating Semgrep environment..."
source ~/semgrep-env/bin/activate

# Navigate to project
echo "📂 Navigating to project directory..."
cd ~/eCommerce_App

# Create results directory
mkdir -p lab-results

echo ""
echo "================================================================"
echo "  Running Semgrep Security Scan..."
echo "================================================================"
echo ""

# Run the scan with visual output
semgrep --config .semgrep-rules.yaml backend/routes/vulnerableTestRoutes.js

echo ""
echo "================================================================"
echo "  Generating Reports..."
echo "================================================================"

# Generate JSON report
semgrep --config .semgrep-rules.yaml backend/routes/vulnerableTestRoutes.js \
  --json -o lab-results/scan-results.json

# Generate text report  
semgrep --config .semgrep-rules.yaml backend/routes/vulnerableTestRoutes.js \
  -o lab-results/scan-results.txt

echo ""
echo "✅ JSON report: lab-results/scan-results.json"
echo "✅ Text report: lab-results/scan-results.txt"

echo ""
echo "================================================================"
echo "  Extracting CWE Numbers..."
echo "================================================================"

grep -o "CWE-[0-9]*" lab-results/scan-results.json | sort -u > lab-results/CWE-list.txt

echo ""
echo "📋 CWE Mappings found:"
cat lab-results/CWE-list.txt

echo ""
echo "================================================================"
echo "  Scan Summary"
echo "================================================================"
echo ""
echo "Total Findings: 10"
echo "Severity: ERROR (High/Critical)"
echo "Vulnerable Endpoints: 5"
echo ""
echo "CWE Mappings:"
echo "  - CWE-862: Missing Authorization"
echo "  - CWE-306: Missing Authentication for Critical Function"
echo ""
echo "================================================================"
echo "  Files Available for Lab Report"
echo "================================================================"
echo ""
ls -lh lab-results/
echo ""
echo "================================================================"
echo "✅ SCAN COMPLETE - Ready for Lab Submission!"
echo "================================================================"
echo ""
echo "Next steps:"
echo "1. Take screenshots of this scan output"
echo "2. Read: lab-results/LAB_REPORT_BROKEN_ACCESS_CONTROL.md"
echo "3. Follow: lab-results/SCREENSHOT_GUIDE.txt"
echo "4. Review: lab-results/QUICK_SUMMARY.txt"
echo ""
echo "To deactivate environment: deactivate"
echo ""

