import { Router } from 'express';
import { placeOrder } from '../../controller/placeOrder';
import { cancleOrder } from '../../controller';
import { getTheKline } from '../../controller/getKline';
import { getMyBalance } from '../../controller/getbalance';
const router = Router();

router.post('/place-order', placeOrder);
router.post('/cancle-order', cancleOrder)
router.get('/kline',getTheKline )
router.get('/wallet-balance', getMyBalance)
export { router as placeOrderRouter };
