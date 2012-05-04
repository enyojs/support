beforeEach(function() {
  this.addMatchers({  
    toBeValidCypher: function() {
      var cypher = this.actual;
      var message = "everything is fine";
      this.message = function() { return message; };

      for (var i = 0; i < 26; ++i) {
        var ch = String.fromCharCode(i + 65);
        if (cypher[i] === ch) {
          message = "Expected cypher[" + i + "] to not contain " + ch;
          return false;
        }
      }
      return true;
    }
  });
});

describe('generateCypherAlphabet',function(){
  it('is valid cypher x1000',function(){
    for (var i = 0; i < 1000; ++i) {
      expect(generateCypherAlphabet()).toBeValidCypher();
    }
  });
});