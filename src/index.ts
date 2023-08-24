import App from './app/app';
import './style.scss';
import appRouter from './shared/lib/router/router';
import apiFactory from './shared/lib/api-factory/api-factory';
import CustomerAPI from './entities/customer/api';
import ProductAPI from './entities/product/api';

const app = new App();
appRouter.setRoutes(app.createRoutes());
apiFactory.registerApi([new CustomerAPI(), new ProductAPI()]);
