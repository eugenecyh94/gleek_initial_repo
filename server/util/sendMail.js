import nodemailer from "nodemailer";

const sendMail = async (email, subject, text) => {
   try {
      var smtpConfig = {
         host: "smtp.gmail.com",
         port: 465,
         secure: true, // use SSL
         auth: {
            type: "oauth2",
            user: process.env.EMAIl_ADDRESS,
            project_id: "urbanorigins",
            private_key_id: "bc239916450c69bd19b0ed4336280e3c3f10a5a2",
            private_key:
               "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC4lvAIelwo8hvP\n0ZfUsP2Jy/kM+4qU6XkW5u83h3Lvt5kBquuQ4dsnhuHV4WpZ+eSVaxqTYp96mJhn\nv3KWjky70TVURukNp3K6gi+PzRWTaPpnJ+wUNzzTN8JsJXAgrzB6/tgJD12GJmY+\nZc9AxBw5SOTk5zvHmie+wcyzYXixnQeocKv9do0mx8ln1cYo1JsePNnYgneZu1LR\nGdxMkREVc1AZlhSWXpqJpGuSdUbDt9unpFiBio0hNeefuQA3hjKdAu3/weEMWLM9\niLcdRnpYTcZ6v1zG22uzjL4Mb7RtmApNtjTR2J1igH2VFH9cDyWICCpDwo0hnPCZ\n5WsgDvVDAgMBAAECggEACL/q19QI+03ioJq0Qjozgm0fPIzN2FoqybmfnDe47ID8\n6TXTXbY+/6Qmn09EjchJHAYMJ/FUUujZzI0oHtfW7k4v43NLB8EosIuMOppDjA29\nVNdxGtI1eWOavSqXIo17VFExJ1jJm5rFXO7RgKXrGpIIe4s0a7U0bhfcnqIfqPeO\nOjAAEOJZwvTAvPs7hkJwDjDXz2MbDVx1rPMD2ENxqSP0EAcIl+ioR8tVvvmyfsJ/\nDdHyEWOEhcYZ3N2i64TvFVR00AokV1G+Ae/EPxPbCyNNascoCPJJ6moE6ovlcMTn\nIKCq5lYuZBMVO6TkuqnzCkyhVhWH8Cfg4wlnjY38tQKBgQD7bAhVJhwzoFk5y62W\nIdCOTyr24WyX8ej7pCDaK/v89Tk1fwFxb1YU/25eCG4PLz6hN6kdZaFeatyru5nK\nn/X29yqDU9oz+VSKavsor7QFhVZRvvQ6Ix9vriz5R1RSJRcGnjd+rnT8jUfLUBCF\niLKZwf2N2kck4khYOGKqkZyP3wKBgQC782AeZr/dOpMCrFo/+VbYDqfo9kSvsmj6\no5/Rm3hIh8NWZG5EOS79kidsE5zfSJOdN+ch8nPh18vFBT/771b+BrZpZP8sEWcF\nnp0IsWKmWgu5Sk/Tztkggs3hJ29bzPJAVc+XsC0jTf4Jr4RrQVx863DJGcNuCq/b\nwZ2Ri853HQKBgG5QWVua7BbOzTdpoZFU5t/55n0KLY6BitsWiX+QevDjW6WYQzbV\nRezSokdJ5Zht/0nXVTFbzTDTLF2BY5ofE1m32wRiP0Q8qpZNGEQiy5b8iQI3CYuU\nq49h2cPKQzoDohW6R9kijJvfFVgkmgstDkgecLTTyBFr45gprUjvuMT7AoGAWoYc\n3Gemr1n/5oC2sytXjZZ5fvXmHS1z7IwUdLNJ2r0w8xJKHafhHxZe0God21ksZ8O+\nGhaZg8QZC9q8d45OOulmwBp54HK9SPKdNcuh9PdXwDWvfxeYclUt7ey9cNykLSJn\naurawq9U1LtprvL7JduMJf+3pe+VxeVaC/jnR20CgYEAy1yhJ/N6df+rFtLkhQr7\nq3kr89a45CkcYEe3FH85R/7AlS8iHlxA3g4u0ItKkWOm2ySKK9VMlyJd1sfroYWt\nytUnHGbcPBaC4V1z1ZzRDvr9yonw0GfStU29KzsWD39wsglPVqLvmOABBnyWDmpa\nnAtZbZ8FlKMBe+p8vArMnTI=\n-----END PRIVATE KEY-----\n",
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: process.env.ACCESS_TOKEN,
            //expires: 1484314697598,
         },
         tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
         },
      };
      const transporter = nodemailer.createTransport(smtpConfig);

      await transporter.sendMail({
         from: process.env.EMAIl_ADDRESS,
         to: email,
         subject: subject,
         text: text,
      });
   } catch (err) {
      console.log("ERROR SENDING EMAIL: ", err.message);
      throw err;
   }
};

export default sendMail;
