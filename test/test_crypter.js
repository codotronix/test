const expect = require('chai').expect
const crypter = require('../src/utils/crypter')


describe('Utils >> Crypter', () => {
 
    it('Properly encrypt and decrypt a given string and match', () => {
        let s = "Everything is awesome !@#$%^&* 12345"
        let encrypted = crypter.encrypt(s)
        let decrypted = crypter.decrypt(encrypted)
        expect(decrypted).to.equal(s)
    })

    it('Test creation and decryption of customized jwt token and match', () => {
        let jsonData = { email: 'abc_xyz.9@testmail.com' }
        let tok = crypter.createToken(jsonData)
        let decryptedToken = crypter.decodeToken(tok)
        expect(decryptedToken).to.deep.equal(jsonData)
    })

    it('Decode-token should return false for an invalid token', () => {
        let r = crypter.decodeToken('nonsense.invalidtoken.badsign')
        expect(r).to.equal(false)
    })

    it('Hash function should always return same hash for same strings', () => {
        let h1 = crypter.hash('abc')
        let h2 = crypter.hash('abc')
        let h3 = crypter.hash('xyz')
        let h4 = crypter.hash('xyz')

        expect(h1).to.equal(h2)
        expect(h3).to.equal(h4)
        expect(h1).to.not.equal(h3)
    })
})
