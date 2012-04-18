describe('findHashTags',function(){
  it('string with none',function(){
    expect(findHashTags("")).
      toEqual([]);
  });
  it('string with one',function(){
    expect(findHashTags("Are we #there yet?")).
      toEqual([7,12]);
  });
  it('string with three',function(){
    expect(findHashTags("#up to the #Minute in #2011")).
      toEqual([0,2, 11,17, 22,26]);
  });
  it('abbreviated hashtags',function(){
    expect(findHashTags("#one! #two? #three-#four#five")).
      toEqual([0,3, 6,9, 12,17, 19,23, 24,28]);
  });
});