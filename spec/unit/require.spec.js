require.paths.push("http://localhost:8000/spec/fixtures/")

describe 'require'
  before_each
    require.clearCache();
  end
  
  it 'should be a function'
    require.should.be_a Function
  end
  
  it 'should return the specified module'
    test_module = require('test_module')
    
    test_module.test.should.be_a Function
    test_module.test().should.equal "Hello World!"
    
    test_module.this_test.should.be_a Function
    test_module.this_test().should.equal "This is awesome!"
  end
  
  it 'should cache modules'
    var test_module = require('test_module')
    var another_module = require('another_module')
    test_module.should.equal require('test_module')
  end
  
  it 'should cache scripts'
    require.fetch('test_module')
    require.fetch('another_module')
    window.require.should_not.receive('fetch')
    require('test_module')
  end
  
  describe 'fetch'
    it 'should be a function'
      require.fetch.should.be_a Function
    end
    
    it 'should throw an error on relative urls'
      -{ require.fetch('./module') }.should.throw_error "Relative identifier loading is not yet implemented."
    end
    
    it 'should throw an error when no valid identifier is passed'
      -{ require.fetch() }.should.throw_error "No valid identifier given. Must be a string."
    end
    
    it 'should throw an error when an empty string is passed'
      -{ require.fetch('') }.should.throw_error "Identifier is blank."
    end
    
    it 'should return the contents of the script'
      require.fetch('test_module').should.equal fixture('test_module.js')
    end
    
    it 'should throw an exception when no existing file is found'
      -{ require.fetch('missing') }.should.throw_error "Module not found."
    end
  end
  
  describe 'paths'
    it 'should be an array'
      require.paths.should.be_an Array
    end
  end
  
  describe 'load'
    it 'should be a function'
      require.load.should.be_a Function
    end
    
    it 'should eval a CommonJS module and return the exports object'
      var test_module = require.load(fixture('test_module.js'))
      
      test_module.test.should.be_a Function
      test_module.test().should.equal "Hello World!"
      
      test_module.this_test.should.be_a Function
      test_module.this_test().should.equal "This is awesome!"
    end
  end
  
  describe 'caching'
    describe 'clearModuleCache'
      it 'should remove all modules from cache'
        var test_module = require('test_module')
        var another_module = require('another_module')
        require.clearModuleCache()
        test_module.should_not.equal require('test_module')
        another_module.should_not.equal require('another_module')
      end
      
      describe 'with identifier'
        it 'should remove specified module from cache'
          var test_module = require('test_module')
          var another_module = require('another_module')
          require.clearModuleCache('test_module')
          test_module.should_not.equal require('test_module')
          another_module.should.equal require('another_module')
        end
      end
    end

    describe 'clearScriptCache'
      it 'should remove all scripts from cache'
        require.fetch('test_module')
        require.fetch('another_module')
        require.clearScriptCache()
        window.require.should.receive('fetch', 'twice')
        require('test_module')
        require('another_module')
      end
      
      describe 'with identifier'
        it 'should remove specified script from cache'
          require.fetch('test_module')
          require.fetch('another_module')
          require.clearScriptCache('test_module')
          window.require.should.receive('fetch', 'once')
          require('test_module')
          require('another_module')
        end
      end
    end

    describe 'clearCache'
      it 'should remove all scripts and modules from cache'
        var test_module = require('test_module')
        var another_module = require('another_module')
        require.clearCache()
        window.require.should.receive('fetch', 'twice')
        test_module.should_not.equal require('test_module')
        another_module.should_not.equal require('another_module')
      end
      
      describe 'with identifier'
        it 'should remove specified script and module from cache'
          var test_module = require('test_module')
          var another_module = require('another_module')
          require.clearCache('test_module')
          window.require.should.receive('fetch', 'once')
          test_module.should_not.equal require('test_module')
          another_module.should.equal require('another_module')
        end
      end
    end
  end
end
