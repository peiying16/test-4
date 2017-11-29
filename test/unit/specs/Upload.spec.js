import Vue from 'vue'
import Upload from '@/components/Upload'

let user1 = {id: 3, firstName: 'Brian', lastName: 'Yang', email: 'example@gmail.com', gender: 'Male', credit: '', debit: '$123.45'}
let user2 = {id: 13, firstName: 'Jay', lastName: 'Zhou', email: 'jay@gmail.com', gender: 'Female', credit: '$4321.23', debit: ''}
let testData = []
let testData2 = []
let testDataAll = []
testData.push(user1)
testData2.push(user2)
testDataAll.push(user1)
testDataAll.push(user2)


describe('Upload.vue', () => {
  it('should find upload button', () => {
    const Constructor = Vue.extend(Upload)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('button.btn').textContent)
    .to.equal('Upload a file')
  })
  
  it('upload button should disappear', () => {
    const Constructor = Vue.extend(Upload)
    const vm = new Constructor()
    vm.users = testData;
    vm.$mount()
    expect(vm.$el.querySelector('button.btn'))
    .to.equal(null)
  })

  it('should display correct content on table', () => {
    const Constructor = Vue.extend(Upload)
    const vm = new Constructor()
    vm.users = testData;
    vm.$mount()
    var el = vm.$el.querySelector('td')
    expect(el.textContent).to.equal('Mr') // title
    el = el.nextElementSibling
    expect(el.textContent).to.equal('Brian Yang') // full name
    el = el.nextElementSibling
    expect(el.textContent).to.equal('example@gmail.com') // email
    el = el.nextElementSibling
    expect(el.textContent).to.equal('$123.45') // balance
    expect(vm.$el.querySelector('.green').textContent).to.equal('$123.45') // apply green class
    expect(vm.$el.querySelector('.red')).to.equal(null)

    vm.users = testData2; // use another data
    vm.$mount()
    var el = vm.$el.querySelector('td')
    expect(el.textContent).to.equal('Ms') // title
    el = el.nextElementSibling
    expect(el.textContent).to.equal('Jay Zhou') // full name
    el = el.nextElementSibling
    expect(el.textContent).to.equal('jay@gmail.com') // email
    el = el.nextElementSibling
    expect(el.textContent).to.equal('$4321.23') // balance
    expect(vm.$el.querySelector('.red').textContent).to.equal('$4321.23') // apply red class
    expect(vm.$el.querySelector('.green')).to.equal(null)
  })

  it('balance filter should get correct content', () => {
    const Constructor = Vue.extend(Upload)
    const vm = new Constructor()
    vm.users = testDataAll;
    vm.$mount()
    expect(vm.$el.querySelectorAll('tr').length).to.equal(3) // heading and 2 row

    vm.balanceFilter = 'Credit';
    vm.$mount()
    expect(vm.$el.querySelectorAll('tr').length).to.equal(2) // heading and 1 row
    expect(vm.$el.querySelector('.red').textContent).to.equal('$4321.23') // apply red class
    expect(vm.$el.querySelector('.green')).to.equal(null)

    vm.balanceFilter = 'Debit';
    vm.$mount()
    expect(vm.$el.querySelectorAll('tr').length).to.equal(2) // heading and 1 row
    expect(vm.$el.querySelector('.green').textContent).to.equal('$123.45') // apply green class
    expect(vm.$el.querySelector('.red')).to.equal(null)
  })

  
})
