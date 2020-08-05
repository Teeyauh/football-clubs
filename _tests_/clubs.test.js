/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { expect } from 'chai'
import supertest from 'supertest'
import server from '../app'
import models from '../models'

const chai = require('chai')

const should = chai.should()

const request = supertest.agent(server)
const clubsModel = models.Clubs
let newClub = {}

describe('Football Clubs Api', () => {
  before(async () => {
    // create database tables
    await models.sequelize.sync()

    await clubsModel.create({
      name: 'Teeyauh FC.',
      stadium: 'Lokogoma',
      capacity: 70360,
      manager: 'Tayo',
      captain: 'Pierre',
      country: 'Nigeria'
    })
    // eslint-disable-next-line no-const-assign
    newClub = await clubsModel.create({
      name: 'Leicester City F.C.',
      stadium: 'King Power Stadium',
      capacity: 32312,
      manager: 'Brendan Rodgers',
      captain: 'Wes Morgan',
      country: 'England'
    })
    await clubsModel.create({
      name: 'Chelsea F.C.',
      stadium: 'Stamford Bridge',
      capacity: 41837,
      manager: 'Frank Lampard',
      captain: 'César Azpilicueta',
      country: 'England'
    })
  })

  describe('Index route', () => {
    it('should return welcome message when /clubs route is matched', (done) => {
      request.get('/').end((err, res) => {
        res.status.should.be.equal(200)
        expect(res.body.message).be.equal('Welcome to football clubs Api')
        done()
      })
    })
  })
  describe('Get all Clubs', () => {
    it('it should GET all clubs', (done) => {
      request.get('/clubs').end((err, res) => {
        res.status.should.be.equal(200)
        expect(res.body.clubs).to.be.an('array')
        expect(res.body.message).be.equal('Clubs retrieved successfully')
        done()
      })
    })
  })
  describe('Update club route', () => {
    it('should UPDATE a club by the id', (done) => {
      request
        .put(`/clubs/${newClub.id}`)
        .send({
          name: 'Man City F.C.',
          stadium: 'King Power Stadium',
          capacity: '32312',
          manager: 'Brendan Rodgers',
          captain: 'Silva',
          country: 'England'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.message).be.equal('Club updated successfully')
          done()
        })
    })
    it('should return club with this id does not exist', (done) => {
      request
        .put('/clubs/23456')
        .send({
          name: 'cardiff City F.C.',
          stadium: 'King Power Stadium',
          capacity: '32312',
          manager: 'Brendan Rodgers',
          captain: 'Morgan',
          country: 'England'
        })
        .end((err, res) => {
          res.status.should.be.equal(404)
          expect(res.body.message).be.equal('Club not found')
          done()
        })
    })
    it('should return name cannot be empty if user doesnt put a name', (done) => {
      request
        .put(`/clubs/${newClub.id}`)
        .send({
          name: '',
          stadium: 'somewhere',
          capacity: 57000,
          manager: 'Paul',
          captain: 'CR',
          country: 'Nigeria'
        })
        .end((err, res) => {
          res.status.should.be.equal(400)
          expect(res.body.message).be.equal('Name cannot be empty')
          done()
        })
    })
    it('should return capacity must be a number if the capacity entered isnt a number', (done) => {
      request
        .put(`/clubs/${newClub.id}`)
        .send({
          name: 'test club',
          stadium: 'somewhere',
          capacity: '',
          manager: 'Paul',
          captain: 'CR',
          country: 'Nigeria'
        })
        .end((err, res) => {
          res.status.should.be.equal(400)
          expect(res.body.message).be.equal('Capacity must be a number')
          done()
        })
    })
    it('should return stadium cannot be empty if user doesnt put a stadium', (done) => {
      request
        .put(`/clubs/${newClub.id}`)
        .send({
          name: 'test club',
          stadium: '',
          capacity: '57000',
          manager: 'Paul',
          captain: 'CR',
          country: 'Nigeria'
        })
        .end((err, res) => {
          res.status.should.be.equal(400)
          expect(res.body.message).be.equal('Stadium cannot be empty')
          done()
        })
    })
  })
})
