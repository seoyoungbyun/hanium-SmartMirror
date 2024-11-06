var NodeHelper = require("node_helper");
var { exec } = require("child_process");

module.exports = NodeHelper.create({
   socketNotificationReceived: function(notification, payload) { // Fixed 'fuction' to 'function' and corrected parentheses
      if (notification === "RUN PYTHON_SCRIPT") {
         this.runPythonScript();
      }
   },

   runPythonScript: function() {
      exec("python3 ~/MagicMirror/both.py", (error, stdout, stderr) => {
         if (error) {
            console.error(`exec error: ${error}`);
            return;
         }
         console.log(`stdout: ${stdout}`);
         console.error(`stderr: ${stderr}`);
      });
   }
});
