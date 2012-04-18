describe('wrapStringAtSpace',function(){
  it('wrap at word end',function(){
    expect(wrapStringAtSpace("foo bar", 3)).
      toEqual(["foo","bar"]);
  });
  it('wrap inside word',function(){
    expect(wrapStringAtSpace("foo", 2)).
      toEqual(["fo", "o"]);
  });
  it('handle zero length string',function(){
    expect(wrapStringAtSpace("", 40)).
      toEqual(["", null]);
  });
  it('handle short string',function(){
    expect(wrapStringAtSpace("foo bar", 10)).
      toEqual(["foo bar", null]);
  });
  it('trim spaces', function() {
    expect(wrapStringAtSpace("   foo   bar   ", 6)).
      toEqual(["foo", "bar"]);
  });
  it('trim spaces #2', function() {
    expect(wrapStringAtSpace("   foo   bar   ", 7)).
      toEqual(["foo bar", null]);
  });
  it('no spaces', function() {
    expect(wrapStringAtSpace("foobarbaz", 6)).
      toEqual(["foobar", "baz"]);
  });
});