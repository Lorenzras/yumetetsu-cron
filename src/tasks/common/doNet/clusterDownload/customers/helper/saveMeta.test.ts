import {saveMeta} from './saveMeta';

describe('save meta', () => {
  it('should save json file', async () =>{
    await saveMeta('test', [
      {test: 'test'},
    ]);
  });
});
