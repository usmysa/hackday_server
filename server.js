var http = require("http");
var mysql = require("mysql");
var server = http.createServer();

var io = require('socket.io')(server);

io.on('connection', function(socket) {

	// 鍵の解除
	socket.on("unlock", function(){
	  socket.broadcast.emit("unlock_result", "ON");
	});

        socket.on("check_location", function(lat, lng){
          var connection = mysql.createConnection({
            host     : '111.171.213.76',
            user     : 'root',
            password : 'hacker_wiz',
            database : 'HackDay'
          });

          var sql = "SELECT * FROM love_hotel;";
          var user_id = "012345";
          connection.connect();

          var query = connection.query(sql, [user_id]);
          var hotel_list = [];

          query
          .on('result', function(rows) {
            hotel_list.push(rows);
          })
          .on('end', function() {
            connection.destroy(); // disconnect
            var hotel_flag = "OFF";
            for(var i = 0; i < hotel_list.length; i++) {
            hotel_lat = hotel_list[i]["lat"];
            hotel_lng = hotel_list[i]["lng"];
            if (lat == hotel_lat && lng == hotel_lng) {
              hotel_flag = "ON";
              break;
            }
          };

          socket.broadcast.emit("check_result", { flag: hotel_flag });
        });
      });

});

server.listen(3000);
