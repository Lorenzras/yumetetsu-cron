import {IAction, IProperty} from '../types';

export const handleAddPropertyType = (action: IAction, dtArr: IProperty[]) => {
  return dtArr.map((dt) => ({
    ...dt,
    物件種別: action.type,
  }));
};
