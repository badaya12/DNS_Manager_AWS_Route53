import express from 'express'
import cors from 'cors'
// import {router as awsRouter}from './routes/aws';
import AWS from 'aws-sdk';
import path from 'path';

const app = express();

app.use(express.json());
app.use(cors());

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, '/client/dist')));

// app.use("/Aws",awsRouter)
app.post('/api/authorize', (req, res) => {
  // Extract credentials from the request body
  const { accessKeyId, secretAccessKey, region } = req.body;

  const credentials = new AWS.Credentials({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  });
  
  const iam = new AWS.IAM({
    credentials: credentials,
    region: region
  });
  
  // Call the getUser API to get information about the user
  iam.getUser({}, (err, data) => {
    if (err) {
      console.error('Error fetching user information:', err);
      return res.status(500). json(err);
      // Handle error
    } else {
      console.log('User information:', data);
      // Return the user information to the client
      return res.status(200).json(data);
    }
  });
  
  
});
app.post("/api/login", async (req, res) => {
    try {
        const { params } = req.body;
        const { accessKeyId, secretAccessKey, region } = req.body;

        // Update AWS configuration with provided credentials
        AWS.config.update({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            region: region
        });

        const route53 = new AWS.Route53();

        route53.changeResourceRecordSets(params, function (err, data) {
            if (err) {
                console.log(err)
                return res.status(401).json({ error: "Couldn't fetch your data" });
            } else {
                return res.json({ data: data });
            }
        });
    } catch (error) {
        console.error("Error updating AWS configuration:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/api/getZone', async (req, res) => {
    try {
      const { accessKeyId, secretAccessKey, region } = req.query;
  
      // Configure AWS credentials
      AWS.config.update({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
      });
  
      // Create a new Route 53 object
    //   console.log()
      const route53 = new AWS.Route53();
  
      // Define parameters for listing hosted zones
      const params = {};
  
      // Call the listHostedZones method to retrieve the list of hosted zones
      const data = await route53.listHostedZones(params).promise();
      console.log(data);
      res.json({ hostedZones: data.HostedZones });
    } catch (error) {
      console.error('Error fetching hosted zones:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/createZone', async (req, res) => {
    try {
      const { accessKeyId, secretAccessKey, region, domainName } = req.body;
  
      // Configure AWS credentials for this request
      const route53 = new AWS.Route53({
        accessKeyId,
        secretAccessKey,
        region
      });
  
      // Define parameters for creating the hosted zone
      const params = {
        Name: domainName,
        CallerReference: Date.now().toString() // Use a unique caller reference
      };
  
      // Call the createHostedZone method to create the hosted zone
      const data = await route53.createHostedZone(params).promise();
  
      res.json({ success: true, hostedZone: data.HostedZone });
    } catch (error) {
      console.error('Error creating hosted zone:', error);
      res.status(500).json({ success: false, error: 'Failed to create hosted zone' });
    }
  });
  app.delete('/api/deleteRecord', async (req, res) => {
    try {
      const recordsToDelete = req.body.records;
      
      const { accessKeyId, secretAccessKey, region,hostedZoneId} = req.body;
      console.log(recordsToDelete);
      // Configure AWS credentials for this request
      const route53 = new AWS.Route53({
        accessKeyId,
        secretAccessKey,
        region
      });

      // Construct the change batch for deleting records
      const changeBatch = recordsToDelete.map(record => ({
        Action: 'DELETE',
        ResourceRecordSet: record
      }));
  
      // Construct params to delete records
      const params = {
        HostedZoneId: hostedZoneId, // Assuming all records belong to the same hosted zone
        ChangeBatch: {
          Changes: changeBatch
        }
      };
  
      // Send request to delete records
      const data = await route53.changeResourceRecordSets(params).promise();
  
      res.status(200).json({ message: 'Records deleted successfully', data });
    } catch (error) {
      console.error('Error deleting records:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/getRecords', async (req, res) => {
    try {
        const { accessKeyId, secretAccessKey, region,hostedZoneId} = req.query;
      
        console.log(hostedZoneId);
      // Configure AWS credentials for this request
      AWS.config.update({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
      });
  
      // Create a new Route 53 object
    //   console.log()
      const route53 = new AWS.Route53();

        const params = {
            HostedZoneId: hostedZoneId
        };

        const data = await route53.listResourceRecordSets(params).promise();
        const records = data.ResourceRecordSets;
        console.log(records);
        return res.json({Records : records});
    } catch (error) {
        console.error('Error fetching records:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/deleteHostedZone', async (req, res) => {
  try {
      const { accessKeyId, secretAccessKey, region,hostedZoneId} = req.body;
    // Construct params to delete the hosted zone
    AWS.config.update({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region
    });
    const params = {
      Id: hostedZoneId // The ID of the hosted zone to delete
    };

    const route53 = new AWS.Route53();
    // Send request to delete the hosted zone
    await route53.deleteHostedZone(params).promise();

    res.status(200).json({ message: 'Hosted zone deleted successfully' });
  } catch (error) {
    console.error('Error deleting hosted zone:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// })
app.listen(3001,()=>{console.log("server started")});

