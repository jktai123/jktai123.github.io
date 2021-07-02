// Dimensions of sunburst.
// 定義畫布寬度
var width = 750;
// 定義畫布高度
var height = 600;
// 定義放射狀的圓周的半徑
var radius = Math.min(width, height) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
// 此處定義光芒圖左上角的 輔助顯示訪問序列的元素的相關尺寸：寬、高、空隙、間隔等
var b = {
  w: 75, h: 30, s: 3, t: 10
};

// Mapping of step names to colors.
// 定義頁面對應的顏色值
var colors = {
  "home": "#5687d1",
  "product": "#7b615c",
  "search": "#de783b",
  "account": "#6ab975",
  "other": "#a173d1",
  "end": "#bbbbbb"
};

// Total size of all segments; we set this later, after loading the data.
// 總的節點數目
var totalSize = 0; 
// 定義svg畫布
var vis = d3.select("#chart").append("svg:svg")
     // 設置畫布的寬度
    .attr("width", width)
     // 設置畫布的高度
    .attr("height", height)
     // 添加g元素
    .append("svg:g")
     // 設置g元素的id
    .attr("id", "container")
     // 定位g元素到畫布中心
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// 此處用d3.partition()來定義分區佈局函數partition()
var partition = d3.partition()
     //設置佈局的尺寸，由於是圓形的佈局方式，因此尺寸大小通過[2 * Math.PI, radius * radius]確定
    .size([2 * Math.PI, radius * radius]);

// 定義一個圓弧生成器
var arc = d3.arc()
    // 設置圓弧的起始角度的獲取方式
    .startAngle(function(d) { return d.x0; })
    // 設置圓弧的結束角度的獲取方式
    .endAngle(function(d) { return d.x1; })
    // 設置圓弧的內半徑的獲取方式
    .innerRadius(function(d) { return Math.sqrt(d.y0); })
    // 設置圓弧的外半徑的獲取方式
    .outerRadius(function(d) { return Math.sqrt(d.y1); });

// Use d3.text and d3.csvParseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.
// d3.text(url,[callback])用來讀取url指定的文本文件，並對其執行callback函數
d3.text("visit-sequences.csv", function(text) {
  // 將文本文件按行轉換爲數組
  var csv = d3.csvParseRows(text);

  // 將數組文件轉換爲以root爲根節點的樹形層次結構
  var json = buildHierarchy(csv);
  // 將樹形結構的數據構造成可以用於可視化的形式
  console.log('raw:',text);
  console.log('csv:',csv);
  console.log('json:',json);
  createVisualization(json);
});

// Main function to draw and set up the visualization, once we have the data.
// 該方法用來將數據構造成可用於可視化的形式
function createVisualization(json) {

  // Basic setup of page elements.
  // 初始化光芒圖左上角的表示頁面訪問序列的元素
  initializeBreadcrumbTrail();
  // 繪製圖例legend
  drawLegend();

  // 切換是否顯示圖例
  d3.select("#togglelegend").on("click", toggleLegend);

  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  // 添加一個透明度爲0的圓，來輔助監測鼠標動作的離開
  vis.append("svg:circle")
      .attr("r", radius)
      .style("opacity", 0);

  // Turn the data into a d3 hierarchy and calculate the sums.
  // 對數據進行層級佈局
  var root = d3.hierarchy(json)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });

  // For efficiency, filter nodes to keep only those large enough to see.
  // 爲了提高效率，將值過於小的節點過濾掉，只留較大節點進行顯示
  // partition()將root數據進行分區佈局，類似樹型結構，然後通過descendants將佈局後的
  // 數據結構按照從根節點開始，以拓撲順序跟隨子節點進行排序，最後返回拓撲排序的節點數組
  var nodes = partition(root).descendants()
      .filter(function(d) {
          // 弧度大於0.005的節點保留
          return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
      });

  // 繪製圓弧
  var path = vis.data([json]).selectAll("path")
      .data(nodes)
      .enter().append("svg:path")
      .attr("display", function(d) { return d.depth ? null : "none"; })
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      .style("fill", function(d) { return colors[d.data.name]; })
      .style("opacity", 1)
      .on("mouseover", mouseover);

  // Add the mouseleave handler to the bounding circle.
  // 設置鼠標離開的事件監聽
  d3.select("#container").on("mouseleave", mouseleave);

  // Get total size of the tree = value of root node from partition.
  totalSize = path.datum().value;
 };

// Fade all but the current sequence, and show it in the breadcrumb trail.
// 鼠標移動在當前節點上時，顯示當前節點的路徑，並且將該路徑顯示在左上角的序列中
function mouseover(d) {
  // 計算當前節點佔比
  var percentage = (100 * d.value / totalSize).toPrecision(3);
  var percentageString = percentage + "%";
  if (percentage < 0.1) {
    percentageString = "< 0.1%";
  }
  // 左上角的序列中顯示當前節點的百分比文字
  d3.select("#percentage")
      .text(percentageString);

  // 填充圓弧中心的解釋性文字
  d3.select("#explanation")
      .style("visibility", "");

  // ancestors()從當前節點開始，返回祖先節點的數組，一直到根節點結束
  // reverse()將該數組反轉
  var sequenceArray = d.ancestors().reverse();
  // 反轉後根節點位於第一個位置，將其移除
  sequenceArray.shift(); // remove root node from the array
  // 繪製坐上角的序列圖形
  updateBreadcrumbs(sequenceArray, percentageString);

  // Fade all the segments.
  // 先將所有的path元素的透明度都設置爲0.3，以便後面高亮顯示當前路徑上的節點元素
  d3.selectAll("path")
      .style("opacity", 0.3);

  // Then highlight only those that are an ancestor of the current segment.
  // 將當前節點的所有父節點高亮顯示，將其透明度設置爲1
  vis.selectAll("path")
      .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
      .style("opacity", 1);
}

// Restore everything to full opacity when moving off the visualization.
// 當鼠標離開時，將所有的元素恢復爲透明度爲1的狀態
function mouseleave(d) {

  // Hide the breadcrumb trail
  // 將左上角的序列隱藏
  d3.select("#trail")
      .style("visibility", "hidden");

  // Deactivate all segments during transition.
  // 先停止在鼠標移動經過節點時的動作監聽
  d3.selectAll("path").on("mouseover", null);

  // Transition each segment to full opacity and then reactivate it.
  // 將所有元算設置爲透明度1，並且啓動mouseover監聽
  d3.selectAll("path")
      .transition()
      .duration(1000)
      .style("opacity", 1)
      // 重新啓用mouseover監聽
      .on("end", function() {
              d3.select(this).on("mouseover", mouseover);
            });
  // 隱藏圓弧中間的百分比信息
  d3.select("#explanation")
      .style("visibility", "hidden");
}

// 該方法用來初始化光芒圖的左上角的用於輔助顯示訪問序列的元素
function initializeBreadcrumbTrail() {
  // Add the svg area.
  // 創建一個svg畫布
  var trail = d3.select("#sequence").append("svg:svg")
       // 設置畫布的寬度
      .attr("width", width)
       // 設置畫布的高度
      .attr("height", 50)
       // 設置畫布的id
      .attr("id", "trail");
  // Add the label at the end, for the percentage.
  // 在頁面序列元素後，添加顯示序列訪問頻率的百分比的文本顯示元素
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
// 生成繪製左上角序列多邊形圖形的路徑數據
function breadcrumbPoints(d, i) {
  var points = [];
  points.push("0,0");
  // 變量b是在前面定義的關於 序列多邊形的相關尺寸數據
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
// 根據當前鼠標懸浮的節點的路徑，更新左上角的序列
function updateBreadcrumbs(nodeArray, percentageString) {

  // Data join; key function combines name and depth (= position in sequence).
  // 根據name 和depth來計算節點在序列中的位置
  // 爲序列綁定數據nodeArray
  var trail = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) { return d.data.name + d.depth; });

  // Remove exiting nodes.
  // 刪除多於的元素
  trail.exit().remove();

  // Add breadcrumb and label for entering nodes.
  // 根據節點的個數在生成對應的顯示node的元素節點數目
  var entering = trail.enter().append("svg:g");

  // 繪製左上角的序列的圖形，以多邊形polygon元素來繪製
  entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function(d) { return colors[d.data.name]; });

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.data.name; });

  // Merge enter and update selections; set position for all nodes.
  entering.merge(trail).attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

  // Now move and update the percentage at the end.
  d3.select("#trail").select("#endlabel")
      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(percentageString);

  // Make the breadcrumb trail visible, if it's hidden.
  d3.select("#trail")
      .style("visibility", "");

}

// 繪製圖列
function drawLegend() {

  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  // 設置圖列的一些尺寸信息:寬、高、間隔、矩形圓角半徑
  var li = {
    w: 75, h: 30, s: 3, r: 3
  };

  // 定義圖列的畫布
  var legend = d3.select("#legend").append("svg:svg")
      // 設置圖例寬度
      .attr("width", li.w)
      // 設置圖列高度
      .attr("height", d3.keys(colors).length * (li.h + li.s));

  // 定義g元素，用來繪製圖例
  var g = legend.selectAll("g")
       // d3.entries(colors)將colors數組轉換成對象數組，每個對象由key,value字段組成
       // 將轉換後的數據綁定到g元素上，轉換後的數據，key爲頁面名稱，value爲頁面顏色
      .data(d3.entries(colors))
      .enter().append("svg:g")
      // 定位每個g元素，所有圖列元素排成一列
      .attr("transform", function(d, i) {
              return "translate(0," + i * (li.h + li.s) + ")";
           });

  // 以矩形來表示每個圖例
  g.append("svg:rect")
      .attr("rx", li.r) // 設置矩形的圓角半徑
      .attr("ry", li.r) // 設置矩形的圓角半徑
      .attr("width", li.w)  // 設置矩形的寬度
      .attr("height", li.h) // 設置矩形的高度
      // 用網頁對應的顏色來填充對應的圖例
      .style("fill", function(d) { return d.value; });

  // 爲每個圖例矩形添加文本描述
  g.append("svg:text")
      .attr("x", li.w / 2)
      .attr("y", li.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.key; });
}

// 控制圖列的顯示與隱藏
function toggleLegend() {
  var legend = d3.select("#legend");
  if (legend.style("visibility") == "hidden") {
    legend.style("visibility", "");
  } else {
    legend.style("visibility", "hidden");
  }
}

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how 
// often that sequence occurred.
// 採取兩列csv文件的方式，將csv數據轉換成分區佈局所需要的結構格式
// 第一列表示訪問序列的名字，name字段，訪問序列從父頁面到葉子頁面；
// 第二列表示name字段對應的序列的訪問頻率
// 兩列之間用逗號隔開
function buildHierarchy(csv) {
  var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    // csv[i][0]中存儲的是將要放進name字段的值
    var sequence = csv[i][0];
    // csv[i][1]中存儲的是sequence序列的訪問頻率，是數字類型
    var size = +csv[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    // 由於sequence都是以中槓將訪問序列中的頁面名稱連接的，此處以中槓作爲分隔符將其轉換爲數組
    var parts = sequence.split("-");
    // 先初始化當前節點
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      // 初始化當前節點的children字段
      var children = currentNode["children"];
      // 獲取當前節點的名稱
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
   // Not yet at the end of the sequence; move down the tree.
    // 若未到序列的最後，則繼續進行
    var foundChild = false;
    for (var k = 0; k < children.length; k++) {
      if (children[k]["name"] == nodeName) {
        childNode = children[k];
        foundChild = true;
        break;
      }
    }
  // If we don't already have a child node for this branch, create it.
  // 若此節點還沒有創建子節點，那麼爲其創建
    if (!foundChild) {
      childNode = {"name": nodeName, "children": []};
      children.push(childNode);
    }
    currentNode = childNode;
      } else {
    // Reached the end of the sequence; create a leaf node.
    // 若已經到序列的結尾，則創建葉子節點，葉子節點和中間節點不同，葉子節點由name和size字段組成
    childNode = {"name": nodeName, "size": size};
    children.push(childNode);
      }
    }
  }
  return root;
};