
const {readFragment,writeFragment,readFragmentData,writeFragmentData, listFragments}= require('../../src/model/memory/index');

describe('memory-db', () => {
  test('writeFragment insert data to the database', async () => {
    await writeFragment({ ownerId: 'testId', id: '123', fragment: 'testFragment'});
    const result = await readFragment('testId', '123');
    expect(result).toEqual({ ownerId: 'testId', id: '123', fragment: 'testFragment'});
  });

  test('readFragment return Fragment', async () => {
    await writeFragment({ ownerId: 'testId', id: '123', fragment: 'testFragment'});
    const result = await readFragment('testId', '123');
    expect(result).toEqual({ ownerId: 'testId', id: '123', fragment: 'testFragment'});
  });

  test('readFragmentData() returns value what we writeFragmentData() to the database', async () => {
    await writeFragmentData( 'testId', '123',  'testFragment');
    const result = await readFragmentData('testId', '123');
    expect(result).toEqual( 'testFragment');
  });

  test('writeFragmentData() write value to database', async () => {
    await writeFragmentData( 'testId', '123',  'testFragment');
    const result = await readFragmentData('testId', '123');
    expect(result).toEqual( 'testFragment');
  });
   
  test('listFragments() return list of ids/objects', async () =>{
     await writeFragment({ ownerId: 'testId', id: '123', fragment: 'testFragment'});
     await writeFragment({ ownerId: 'testId', id: '456', fragment: 'testFragment2'});
     await writeFragmentData( 'testId', '123',  'testFragment');
     await writeFragmentData( 'testId', '456',  'testFragment2');
     const result= await listFragments('testId');
     expect(Array.isArray(result)).toBe(true);
     expect(result.length).toEqual(2);
  })
});
