import { ClearingHouseUser } from '../clearingHouseUser';
import { isVariant, Order } from '../types';
import { ZERO } from '../constants/numericConstants';

export function isOrderRiskIncreasing(
	user: ClearingHouseUser,
	order: Order
): boolean {
	if (isVariant(order.status, 'init')) {
		return false;
	}

	const position =
		user.getUserPosition(order.marketIndex) ||
		user.getEmptyPosition(order.marketIndex);

	// if no position exists, it's risk increasing
	if (position.baseAssetAmount.eq(ZERO)) {
		return true;
	}

	// if position is long and order is long
	if (position.baseAssetAmount.gt(ZERO) && isVariant(order.direction, 'long')) {
		return true;
	}

	// if position is short and order is short
	if (
		position.baseAssetAmount.lt(ZERO) &&
		isVariant(order.direction, 'short')
	) {
		return true;
	}

	// if order will flip position
	if (position.baseAssetAmount.abs().gt(order.baseAssetAmountFilled)) {
		return true;
	}
}