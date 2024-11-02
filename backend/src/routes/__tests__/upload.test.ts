import request from 'supertest';
import app from '../../server';

describe('Upload Endpoint', () => {
  const mockPdfBuffer = Buffer.from('Mock PDF content');

  it('should process ING statement upload', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('file', mockPdfBuffer, {
        filename: 'test-statement.pdf',
        contentType: 'application/pdf'
      })
      .field('accountId', 'test-account-id');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: expect.any(String)
    });
  });
}); 