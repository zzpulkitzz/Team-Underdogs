const request = require('supertest');
const app = require('../app');
const { sequelize, User, Consultation } = require('../models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

describe('Consultation Endpoints', () => {
  let patientToken, doctorToken, patient, doctor;

  beforeAll(async () => {
    // Sync DB and create test users
    await sequelize.sync({ force: true });
    patient = await User.create({ username: 'patient1', password: 'test1234', role: 'patient' });
    doctor = await User.create({ username: 'doctor1', password: 'test1234', role: 'doctor' });

    patientToken = jwt.sign({ id: patient.id, role: patient.role }, JWT_SECRET);
    doctorToken = jwt.sign({ id: doctor.id, role: doctor.role }, JWT_SECRET);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  let consultationId;

  test('Patient can schedule a consultation', async () => {
    const res = await request(app)
      .post('/api/consultations/schedule')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        patientId: patient.id,
        doctorId: doctor.id,
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    consultationId = res.body.id;
  });

  test('Doctor can list their consultations', async () => {
    const res = await request(app)
      .get('/api/consultations')
      .set('Authorization', `Bearer ${doctorToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].doctorId).toBe(doctor.id);
  });

  test('Patient can list their consultations', async () => {
    const res = await request(app)
      .get('/api/consultations')
      .set('Authorization', `Bearer ${patientToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].patientId).toBe(patient.id);
  });

  test('Doctor can update consultation status', async () => {
    const res = await request(app)
      .patch(`/api/consultations/${consultationId}/status`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({ status: 'confirmed' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('confirmed');
  });

  test('Invalid scheduling returns error', async () => {
    const res = await request(app)
      .post('/api/consultations/schedule')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });
});
