/**
 * This is an example middleware that checks if the user is logged in.
 *
 * If the user is not logged in, it stores the requested url in `returnTo` attribute
 * and then redirects to `/login`.
 *
 */
module.exports = function () {
  return function secured (req, res, next) {
    if (req.user) { return next(); }
    console.log('user From Secured', req.user);
    console.log('req.session.returnTo',req.session.returnTo);
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  };
};