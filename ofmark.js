// Define large flow as greater than 100Mbits/sec for 0.2 seconds or longer
var bytes_per_second = 100000000/8;
var duration_seconds = 0.2;

var idx = 0;

setFlow('tcp',
 {keys:'ipsource,ipdestination,tcpsourceport,tcpdestinationport',
  value:'bytes', filter:'direction=ingress', t:duration_seconds}
);

setThreshold('elephant',
 {metric:'tcp', value:bytes_per_second, byFlow:true, timeout:2, 
  filter:{ifspeed:[1000000000]}}
);

setEventHandler(function(evt) {
 var agent = evt.agent;
 var ports = ofInterfaceToPort(agent);
 if(ports && ports.length == 1) {
  var dpid = ports[0].dpid;
  var id = "mark" + idx++;
  var k = evt.flowKey.split(',');
  var rule= {
   priority:500, idleTimeout:2,
   match:{dl_type:2048, nw_proto:6, nw_src:k[0], nw_dst:k[1],
          tp_src:k[2], tp_dst:k[3]},
   actions:["set_nw_tos=128","output=normal"]
  };
  setOfRule(dpid,id,rule);
 }
},['elephant']);
