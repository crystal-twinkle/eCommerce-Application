import App from './app/app';
import './entities/api/customer';
import './style.scss';
import appRouter from './shared/lib/router/router';

const app = new App();
appRouter.setRoutes(app.createRoutes());
