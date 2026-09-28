"""Convert a PDF to DOCX. Usage: python3 pdf_to_docx.py <input.pdf> <output.docx>"""
import sys
from pdf2docx import Converter

cv = Converter(sys.argv[1])
cv.convert(sys.argv[2])
cv.close()
