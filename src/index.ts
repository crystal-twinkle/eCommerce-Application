import App from './app/app';
import './style.scss';
import appRouter from './shared/lib/router/router';

const app = new App();
appRouter.setRoutes(app.createRoutes());
