package com.agroisync.app.utils;

import android.animation.Animator;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.view.View;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.DecelerateInterpolator;

public class AnimationUtils {
    private static final int DURATION_SHORT = 200;
    private static final int DURATION_MEDIUM = 400;
    private static final int DURATION_LONG = 800;

    public static void fadeIn(View view) {
        fadeIn(view, DURATION_MEDIUM);
    }

    public static void fadeIn(View view, int duration) {
        view.setAlpha(0f);
        view.setVisibility(View.VISIBLE);
        view.animate()
                .alpha(1f)
                .setDuration(duration)
                .setInterpolator(new DecelerateInterpolator())
                .start();
    }

    public static void fadeOut(View view) {
        fadeOut(view, DURATION_MEDIUM);
    }

    public static void fadeOut(View view, int duration) {
        view.animate()
                .alpha(0f)
                .setDuration(duration)
                .setInterpolator(new DecelerateInterpolator())
                .withEndAction(() -> view.setVisibility(View.GONE))
                .start();
    }

    public static void slideInFromRight(View view) {
        view.setTranslationX(view.getWidth());
        view.setVisibility(View.VISIBLE);
        view.animate()
                .translationX(0)
                .setDuration(DURATION_MEDIUM)
                .setInterpolator(new DecelerateInterpolator())
                .start();
    }

    public static void slideOutToLeft(View view) {
        view.animate()
                .translationX(-view.getWidth())
                .setDuration(DURATION_MEDIUM)
                .setInterpolator(new AccelerateDecelerateInterpolator())
                .withEndAction(() -> view.setVisibility(View.GONE))
                .start();
    }

    public static void scaleInFromCenter(View view) {
        view.setScaleX(0);
        view.setScaleY(0);
        view.setVisibility(View.VISIBLE);
        
        AnimatorSet set = new AnimatorSet();
        ObjectAnimator scaleX = ObjectAnimator.ofFloat(view, View.SCALE_X, 0f, 1f);
        ObjectAnimator scaleY = ObjectAnimator.ofFloat(view, View.SCALE_Y, 0f, 1f);
        
        set.playTogether(scaleX, scaleY);
        set.setDuration(DURATION_MEDIUM);
        set.setInterpolator(new DecelerateInterpolator());
        set.start();
    }

    public static void pulseAnimation(View view) {
        AnimatorSet set = new AnimatorSet();
        
        ObjectAnimator scaleX = ObjectAnimator.ofFloat(view, View.SCALE_X, 1f, 1.1f, 1f);
        ObjectAnimator scaleY = ObjectAnimator.ofFloat(view, View.SCALE_Y, 1f, 1.1f, 1f);
        
        set.playTogether(scaleX, scaleY);
        set.setDuration(DURATION_SHORT);
        set.setInterpolator(new AccelerateDecelerateInterpolator());
        set.start();
    }
}