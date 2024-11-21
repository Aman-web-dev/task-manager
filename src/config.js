const getBackendUrl = () => {
  console.log(process.env.NODE_ENV)
  console.log(process.env.NEXT_PUBLIC_DJANGO_SERVER_URL)
    if (process.env.NODE_ENV === "development") {
      return "http://127.0.0.1:8000";
    } else if (process.env.NODE_ENV === "production") {
      return "https://task-manager-server-m05d.onrender.com";
    } else {
      return "http://127.0.0.1:8000"; 
    }
  };
  
  const config = {
    backendUrl: getBackendUrl(),
  };
  
  export default config;
  