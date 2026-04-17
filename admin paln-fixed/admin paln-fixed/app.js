const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'src', 'docs'),
]);

app.use(express.static(path.join(__dirname, 'public')));

const pageRoutes = [
  { paths: ['/', '/index.html'], view: 'dashboard', title: 'Dashboard' },
  {
    paths: ['/buttons', '/pages/ui-features/buttons.html'],
    view: 'ui-features/buttons',
    title: 'Buttons',
  },
  {
    paths: ['/dropdowns', '/pages/ui-features/dropdowns.html'],
    view: 'ui-features/dropdowns',
    title: 'Dropdowns',
  },
  {
    paths: ['/typography', '/pages/ui-features/typography.html'],
    view: 'ui-features/typography',
    title: 'Typography',
  },
  {
    paths: ['/basic-elements', '/pages/forms/basic_elements.html'],
    view: 'forms/basic_elements',
    title: 'Basic Elements',
  },
  {
    paths: ['/charts', '/pages/charts/chartjs.html'],
    view: 'charts/chartjs',
    title: 'Charts',
  },
  {
    paths: ['/tables', '/pages/tables/basic-table.html'],
    view: 'tables/basic-table',
    title: 'Basic Table',
  },
  {
    paths: ['/font-awesome', '/pages/icons/font-awesome.html'],
    view: 'icons/mdi',
    title: 'Font Awesome',
  },
  {
    paths: ['/blank-page', '/pages/samples/blank-page.html'],
    view: 'samples/blank-page',
    title: 'Blank Page',
  },
  {
    paths: ['/error-404', '/pages/samples/error-404.html'],
    view: 'samples/error-404',
    title: '404 Page',
  },
  {
    paths: ['/error-500', '/pages/samples/error-500.html'],
    view: 'samples/error-500',
    title: '500 Page',
  },
  {
    paths: ['/login', '/login.html', '/pages/samples/login.html'],
    view: 'samples/login',
    title: 'Login',
  },
  {
    paths: ['/register', '/register.html', '/pages/samples/register.html'],
    view: 'samples/register',
    title: 'Register',
  },
  {
    paths: ['/documentation', '/docs/documentation.html'],
    view: 'documentation',
    title: 'Documentation',
  },
];

for (const route of pageRoutes) {
  app.get(route.paths, (req, res) => {
    res.render(route.view, { title: route.title });
  });
}


app.use((req, res) => {
  res.status(404).render('samples/error-404', { title: '404 Page' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
