<template>
  <div class="login">
    <h1>{{ heading }}</h1>
    <p>{{ msg }}</p>
    <form action method="post">
      <label for="name">{{ username }}</label>
      <p>
        <input type="text" name="name" />
      </p>
      <label for="password">{{ password }}</label>
      <p>
        <input type="password" name="password" />
      </p>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      heading: "Login",
      msg: "Please log in to get started:",
      username: "Username:",
      password: "Password:"
    };
  }
};
</script>
