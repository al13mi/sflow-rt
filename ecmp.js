include('extras/json2.js');

// Define large flow as greater than 1Mbits/sec for 1 second or longer
var bytes_per_second = 1000000/8;
var duration_seconds = 1;

//var top = JSON.parse(http("http://localhost:8080/controller/web/topology/visual.json"));
//setIntervalHandler(function() {
//  var body = http("http://localhost:8080/controller/nb/v2/topology/default/",'GET',' application/json') 
//  logInfo(JSON.stringify(body));
//} , 2);
//var top = JSON.parse(http("http://localhost:8080/controller/nb/v2/topology/default/",'GET','Aunthorization: Basic YWRtaW46YWRtaW4=','Accept: application/json','Content-Type: application/json'));

top = getTopology();

setTopology(top);

setFlow('tcp',
 {keys:'ipsource,ipdestination,tcpsourceport,tcpdestinationport',
  value:'bytes', t:duration_seconds}
);

setThreshold('elephant',
 {metric:'tcp', value:bytes_per_second, byFlow:true, timeout:2}
);

setEventHandler(function(evt) {
 var rec = topologyInterfaceToLink(evt.agent,evt.dataSource);
 if(!rec || !rec.link) return;
 var link = topologyLink(rec.link);
 logInfo(link.node1 + "-" + link.node2 + " " + evt.flowKey);
},['elephant']);
