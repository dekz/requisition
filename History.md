
0.1 / 2010-03-03
------------------

* Initial release. Basic functionality is in place. An identifier can be passed to require and it will be loaded from the first path it can be found in.

0.2 / 2010-03-04
------------------

* Added caching of scripts and modules. Also removed blocking of window from within modules.

0.3 / 2010-03-17
------------------

* Implemented a test suite based off the CommonJS module test suite. This is now passing 100% making the library 100% compliant with the spec.
* There is no longer a seperate method for loading the module. There is a fetch method which retrieves it from the server and everything else is done inside require.
* Implemented a directory stack in order to track the present working directory. This allows relative url's to be used. Currently only the current directory can be referenced.
