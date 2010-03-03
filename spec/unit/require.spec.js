require.paths.push("http://localhost:8000/spec/fixtures/")

describe 'require'
  before_each
    require.moduleCache = {};
    require.scriptCache = {};
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
    test_module.should.equal require('test_module')
  end
  
  it 'should cache scripts'
    require.fetch('test_module')
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
end
