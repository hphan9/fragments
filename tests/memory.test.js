
const {readFragment,writeFragment,readFragmentData,writeFragmentData}= require('../src/model/memory/index');

describe('memory-db', () => {
  test('writeFragment insert data to the database', async () => {
    await writeFragment({ ownerId: 'emily', id: '123', fragment: 'testFragment'});
    const result = await readFragment('emily', '123');
    expect(result).toEqual({ ownerId: 'emily', id: '123', fragment: 'testFragment'});
  });

  test('readFragment return Fragment', async () => {
    await writeFragment({ ownerId: 'emily', id: '123', fragment: 'testFragment'});
    const result = await readFragment('emily', '123');
    expect(result).toEqual({ ownerId: 'emily', id: '123', fragment: 'testFragment'});
  });

  test('readFragmentData() returns value what we writeFragmentData() to the database', async () => {
    await writeFragmentData( 'emily', '123',  'testFragment');
    const result = await readFragmentData('emily', '123');
    expect(result).toEqual( 'testFragment');
  });

  test('writeFragmentData() write value to database', async () => {
    await writeFragmentData( 'emily', '123',  'testFragment');
    const result = await readFragmentData('emily', '123');
    expect(result).toEqual( 'testFragment');
  });
  
});
