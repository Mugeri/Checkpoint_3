describe('User', function() {
  it('validates that the new user is unique', function() {
    var user = create(user);
    expect(user.firstName && user.lastName).not.toBeDefined();
  });
  it('validates that theirs a role defined', function() {
    var user = create(user);
    expect(user.role).toBeDefined();
  });
  it('validates that user created both first and last name', function() {
    var user = create(user);
    expect(user.firstName && user.lastName).not.toBeDefined();
  });
  it('validates that all users are returned', function() {
    var users = display(user);
    expect(users.length).toBe(User.length);
  });
})
