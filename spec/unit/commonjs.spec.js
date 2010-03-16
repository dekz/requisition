describe 'CommonJS spec'
  it 'should handle cyclic dependencies'
    var a = require('cyclic/a')
    var b = require('cyclic/b')
    
    a.a.should_not.equal undefined
    b.b.should_not.equal undefined
    a.a().b.should.equal b.b
    b.b().a.should.equal a.a
  end
  
  it 'should work with absolute identifiers'
    var a = require('absolute/submodule/a');
    var b = require('absolute/b');
    
    a.foo().foo.should.equal b.foo
  end
  
  it 'should not fall back to relative modules when absolutes are not available.'
    -{ require('determinism/submodule/a'); }.should.throw_error
  end
  
  it 'should return the exact same object each time'
    -{ require('exactExports/program'); }.should_not.throw_error
  end
  
  it 'should correctly bind members'
    var a = require('method/a');
    var foo = a.foo;
    
    a.foo().should.equal a
    foo().should.equal function (){return this}()
    
    a.set(10);
    a.get().should.equal 10
  end
  
  it 'should throw an error when module cannot be found'
    -{ require('bogus'); }.should.throw_error
  end
  
  it 'should allow modules to be edited from outside'
    -{ require('monkeys/program'); }.should_not.throw_error
  end
  
  it 'should allow nested module identifiers'
    require('nested/a/b/c/d').foo().should.equal 1
  end
  
  it 'should allow relative module identifiers'
    require('relative/submodule/a').foo.should.equal require('relative/submodule/b').foo
  end
  
  it 'should allow modules to be chained together'
    require('transitive/a').foo().should.equal 1
  end
end