package com.agroisync.mobile.utils;

import android.content.Context;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.request.RequestOptions;

public class ImageLoader {
    private static RequestOptions defaultOptions;

    static {
        defaultOptions = new RequestOptions()
                .diskCacheStrategy(DiskCacheStrategy.ALL)
                .centerCrop();
    }

    public static void loadImage(Context context, String url, ImageView imageView) {
        Glide.with(context)
                .load(url)
                .apply(defaultOptions)
                .into(imageView);
    }

    public static void loadImageWithPlaceholder(Context context, String url, ImageView imageView, int placeholderResId) {
        Glide.with(context)
                .load(url)
                .apply(defaultOptions)
                .placeholder(placeholderResId)
                .into(imageView);
    }

    public static void clearCache(Context context) {
        new Thread(() -> {
            Glide.get(context).clearDiskCache();
        }).start();
        Glide.get(context).clearMemory();
    }
}