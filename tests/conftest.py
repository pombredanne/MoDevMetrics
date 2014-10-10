import unittest
import pytest

from pyLibrary.env.files import File


def pytest_generate_tests(metafunc):
    if "path" in metafunc.funcargnames:
        ps = [f.abspath.replace("\\", "/") for f in File("./html").children if f.extension=="html"]
        metafunc.parametrize("path", ps)
