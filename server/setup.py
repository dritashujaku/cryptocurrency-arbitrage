from setuptools import setup, find_packages
from os import path

this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, 'README.md'), encoding='utf-8') as readme_file:
    long_description = readme_file.read()

requirements = [
    'fastapi>=0.63.0',
    'numpy>=1',
    'odmantic>=0.3.0'
]

setup(
    name='cryptocurrency-arbitrage-api',
    version='0.0.1',
    author='Drita Shujaku',
    author_email='drita.shujaku@gmail.com',
    description='A package to find arbitrage opportunities in crypto markets',
    long_description=long_description,
    long_description_content_type='text/markdown',
    packages=find_packages(),
    install_requires=requirements,
    classifiers=[
        'Programming Language :: Python :: 3.8',
        'License :: OSI Approved :: MIT License',
    ]
)
