<template>
  <div id="page-wrapper">
    <div class="upload-btn-wrapper" v-if="!users.length">
      <button class="btn">Upload a file</button>
      <input type="file" name="myfile" @change="readFile"/>
      <span class="err">{{errMsg}}</span>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-sm-6"><canvas id="genderChart"></canvas></div>
        <div class="col-md-6 col-sm-6"><canvas id="myChart2"></canvas></div>
      </div>
      
      <table class="table table-striped" v-if="users.length">
        <thead class="fix-top">
          <tr>
            <th>Title</th>
            <th>Full Name</th>
            <th>Email</th>
            <th class="dropdown">Balance
              <!-- <div class="dropdown-content">
                
              </div> -->
              <select v-model="balanceFilter">
                <option value="All">All</option>
                <option value="Credit">Credit</option>
                <option value="Debit">Debit</option>
              </select>
            </th>
            <th>Send Email</th>

          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsersComputed">
            <td>{{ user.gender == 'Male' ? 'Mr' : 'Ms' }}</td>
            <td>{{ user.firstName + ' ' + user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td v-if="user.credit" class="red">{{user.credit}}</td>
            <td v-else class="green">{{user.debit}}</td>
            <td><a class="glyphicon glyphicon-envelope" v-bind:href="'mailto:' + user.email" target="_top"></a></td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Upload',

  data() {
    return {
      users: [],
      balanceFilter: 'All',
      errMsg: ''
    }
  }, //end of data

  methods: {
    filteredUsers: function(){
      return this.users.filter((user)=>{
        if(this.balanceFilter === 'All'){
          return true;
        }else if (this.balanceFilter === 'Credit'){
          return user.credit !== '';
        }else if (this.balanceFilter === 'Debit'){
          return user.credit === '';
        }
        return false;
      });
    }, // end of filteredUsers method

    createChart: function(){
      let usersAfterFilter = this.filteredUsers();
      let numOfMale = usersAfterFilter.filter(user => user.gender === 'Male').length;
      let numOfFemale = usersAfterFilter.filter(user => user.gender === 'Female').length;

      var ctx = document.getElementById('genderChart').getContext('2d');
      var genderChart = new Chart(ctx, {
          // The type of chart we want to create
          type: 'pie',

          // The data for our dataset
          data: {
              labels: ["Male", 'Female'],
              
              datasets: [{
                  backgroundColor: ['rgb(255, 99, 132)', '#1E90FF'],
                  borderColor: '#fff',
                  data: [numOfMale, numOfFemale],
              }]
          },

          // Configuration options go here
          options: {
            title: {
              display: true,
              text: 'Pie Chart of Users by Gender',
              position: 'bottom',
              fontSize: 16
            },
            legend: {
              display: true,
              position: 'right'
            }
          }
      }); // end of chart 1


      let d0 = usersAfterFilter.filter(user => user.credit !== '').length;
      let usersAfterFilterAndDebit = usersAfterFilter.filter(user => user.credit === '');

      let d1 = usersAfterFilterAndDebit.filter(user => {
        var debit = parseFloat(user.debit.substr(1));
        return debit >=0 && debit <= 20;
      }).length;
      let d2 = usersAfterFilterAndDebit.filter(user => {
        var debit = parseFloat(user.debit.substr(1));
        return debit >21 && debit <= 40;
      }).length;
      let d3 = usersAfterFilterAndDebit.filter(user => {
        var debit = parseFloat(user.debit.substr(1));
        return debit >40 && debit <= 60;
      }).length;
      let d4 = usersAfterFilterAndDebit.filter(user => {
        var debit = parseFloat(user.debit.substr(1));
        return debit >60;
      }).length;

      var ctx = document.getElementById('myChart2').getContext('2d');
      var chart = new Chart(ctx, {
          // The type of chart we want to create
          type: 'bar',

          // The data for our dataset
          data: {
              labels: ['Less than 0',"0-20", '21-40','41-60', 'More than 60'],
              datasets: [{
                  backgroundColor: '#1E90FF',
                  borderColor: '#fff',
                  data: [d0, d1, d2, d3, d4],
              }]
          },

          // Configuration options go here
          options: {
            title: {
              display: true,
              text: 'Bar Chart of Users by Balance',
              position: 'bottom',
              fontSize: 16
            },
            legend: {
              display: false
            }
          }
      });
    },  //end of createChart method

    readFile: function(e){
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length){
        // if there is no file, then return
        return;
      }
      var file = files[0];

      var textType = /excel/;
      if (file.type.match(textType)) {
        this.errMsg = '';  //remove err msg
        var reader = new FileReader();
        var data = [];
        var gb = this;
        reader.onload = function(e) {
          var lines = reader.result.split('\n');
          lines.shift(); //remove first line - heading
          lines.forEach(function(line){
            var cols = line.split(',');
            var user = {
              id: cols[0],
              firstName: cols[1],
              lastName: cols[2],
              email: cols[3],
              gender: cols[4],
              credit: cols[5] || '',
              debit: cols[6] || '',
            }

            // this.users.push(user);
            data.push(user);
          });

          gb.users = data;
          gb.createChart();
        }

        reader.readAsText(file);
      } else {
        this.errMsg = 'Invalid file';
      }
    } // end of readFile method
  },  //end of method

  computed: {
    filteredUsersComputed: function(){
      return this.filteredUsers().sort((a,b)=>{
        if(a.firstName > b.firstName){
          return 1;
        }
        if(a.firstName < b.firstName){
          return -1;
        }
        return 0;
      });
    }
  } // end of computed
  
}

</script>

<style scoped>

  /* balance
  red : credit
  green: debit 
  */
  .red{
    color: red;
  }

  .green{
    color: green;
  }


  th {
    text-align: center;
    color: white;
    background-color: #111;
  }

  select{
    background-color: #111;
  }


  /* upload file button */
  .upload-btn-wrapper {
    position: relative;
    overflow: hidden;
    display: inline-block;
    margin-bottom: 3em;
  }

  .btn {
    border: 2px solid gray;
    color: gray;
    background-color: white;
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 20px;
    font-weight: bold;
  }

  .upload-btn-wrapper input[type=file] {
    font-size: 100px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }

  .err{
    color: red;
  }


  /* chart */
  canvas{
    margin: 3em 0;
  }

</style>
