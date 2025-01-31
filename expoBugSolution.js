const killProcess = require('tree-kill');

async function tryStartExpo(projectDir) {
  try {
    // Attempt to start Expo development server
    const { exec } = require('child_process');
    const process = exec(`expo start --project-dir ${projectDir}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Failed to start Expo: ${err}`);
      } else {
        console.log(stdout); 
      }
      if (stderr) {
        console.error(`Expo stderr: ${stderr}`);
      }
    });

    // Set timeout to handle cases where the server hangs
    setTimeout(() => {
      console.log('Checking for Metro Bundler...');
      const metroPID = getMetroBundlerPID();
      if (metroPID){
        console.log('Metro Bundler found. Attempting to kill...');
        killProcess(metroPID, (err) => {
          if(err) {
            console.error(`Error killing Metro Bundler: ${err}`);
          } else {
            console.log('Metro Bundler killed successfully. Restarting...');
            tryStartExpo(projectDir); // Attempt a restart 
          }
        });
      } else {
        console.log('Metro Bundler not found.')
      }
    }, 10000); // Check for hanging after 10 seconds

    //Avoid using process.on('exit') it's not effective
    return process;
  } catch (e) {
    console.error(`An unexpected error occurred: ${e}`);
  }
}

function getMetroBundlerPID() {
  // Implement a way to get Metro Bundler process ID. This may require OS-specific methods or inspecting process lists.
  // Replace this with your actual implementation to find Metro Bundler's PID.   
  // This is highly OS dependent, for example, you can parse the output of `ps aux | grep metro` on Unix-like systems.
  //For Windows systems the approach will be totally different.
  //  Here a placeholder is used to maintain a correct JSON structure.
  return null; 
}

module.exports = { tryStartExpo };
