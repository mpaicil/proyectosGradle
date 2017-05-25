Proyectos Gradle

* prueba - para pruebas y templates

## Requisitos:

Para poder realizar la construccion del proyecto, es necesario realizar los siguientes pasos:

* Ingresar con tu cuenta de LDAP a [JFROG](https://archive.it.lan.com/)
* Presiona sobre tu nombre de usuario, que se encuentra en la parte superior derecha
* Ingresa nuevamente tu contraseña y presiona en UNLOCK
* En el campo `Encrypted Password`, presionar en el icono `show Encrypted Password` y almacenarla en alg&uacute;n editor
* En tu `$HOME`, ingresar a la carpeta `gradle` y generar el archivo gradle.properties
* Dentro del archivo ingresar
   * artifactory_user=`usuario`
   * artifactory_password=`la contraseña encriptada`
   * artifactory_contextUrl=https://archive.it.lan.com/artifactory
* Terminado lo anterior puedes ir al proyecto clonado y realizar el `build` 
