# Manter informações de depuração
-keepattributes SourceFile,LineNumberTable,Exceptions,InnerClasses,Signature,Deprecated,*Annotation*,EnclosingMethod

# Manter WebView JavaScript Interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preservar informações de linha para stack traces
-renamesourcefileattribute SourceFile

# Manter classes Capacitor
-keep class com.getcapacitor.** { *; }
-keep public class * extends com.getcapacitor.Plugin

# Manter classes de plugins Capacitor
-keep class com.agroisync.mobile.** { *; }

# Manter classes do Firebase/Google Services se estiver usando
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }

# Manter enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Manter classes R
-keepclassmembers class **.R$* {
    public static <fields>;
}

# Manter classes nativas
-keepclasseswithmembernames class * {
    native <methods>;
}

# Manter construtores nativos
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}

# Manter Views customizadas
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet, int);
}
