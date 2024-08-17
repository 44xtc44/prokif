# Configuration file for the Sphinx documentation builder.
# https://shunsvineyard.info/2019/09/19/use-sphinx-for-python-documentation/
import os
import sys
import shutil

sys.path.insert(0, os.path.abspath('../..'))

# -- Project information -----------------------------------------------------
# pip install -U sphinx
# !!! indentation of sphinx is mostly 3 leading spaces, code 4, block need one free line above and colon for head
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information
# pip install -U sphinx
# pip install sphinx-rtd-theme
# pip install sphinxcontrib-napoleon
# Use sphinx-apidoc to build your API documentation:
# $ cd docs
# sphinx-apidoc -f -o source/ ../static/
# make html

project = 'PlaylistBooster'
copyright = 'Apache 2.0 License (2024)'
author = 'René Horn'
release = '1.0'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

# Add napoleon to the extensions list
extensions = [
    'sphinx.ext.napoleon',
    'sphinx.ext.autodoc',
    'sphinx.ext.autosectionlabel',
    'sphinx_js',
    'sphinx_toolbox.collapse'
]


# Napoleon settings
napoleon_google_docstring = True
napoleon_numpy_docstring = True
napoleon_include_init_with_doc = False
napoleon_include_private_with_doc = False
napoleon_include_special_with_doc = True
napoleon_use_admonition_for_examples = False
napoleon_use_admonition_for_notes = False
napoleon_use_admonition_for_references = False
napoleon_use_ivar = False
napoleon_use_param = True
napoleon_use_rtype = True
napoleon_preprocess_types = False
napoleon_type_aliases = None
napoleon_attr_annotations = True

templates_path = ['_templates']
exclude_patterns = []

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'sphinx_rtd_theme'
pygments_style = 'sphinx'

html_static_path = ['_static']
html_logo = "./default_icon.svg"
html_logo_only = True
html_display_version = False
html_css_files = [
    "css-style.css",
]

# Java stuff for sphinx-js to search for
js_source_path = '../../static/js' 

# copy the latest readme file
logo_img = 'default_icon.svg'
logo_dir = '../../static/images/'
read_src = '../../.github/'
read_dst = './'
readme_lst = ['README.rst', 'compare_three_countries.png', 'trade_2023.png', 'trade_2024.png']
shutil.copyfile(logo_dir + logo_img, read_dst + logo_img)
[shutil.copyfile(read_src + f, read_dst + f) for f in readme_lst]


