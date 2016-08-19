var aDocument = new Document();
describe('Document', function() {
  it('checks if there is a published date', function() {
    expect(aDocument.published).toBeDefined();
    expect(aDocument.published).toBeTruthy();
  });
  it('checks that specified amount of documents are returned', function() {
    var number = aDocument.all(5).length();
    expect(number).toBe(5);
  });
  it('checks documents are called in order of published date', function() {
    var number = aDocument.all(5);
    expect(number(0)).toBeGreaterThan(number(1));
  });
  it('checks on pagination', function() {

  });
});

describe('Search', function() {
  it('coming soon', function() {

  });
});
