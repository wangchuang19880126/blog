const linear = opt => {
    $(opt.top).animate(
        {
            width: opt.scale
        },
        1000,
        () => {
            $(opt.right).animate(
                {
                    height: opt.scale
                },
                800,
                () => {
                    $(opt.bottom).animate(
                        {
                            width: opt.scale
                        },
                        1000,
                        () => {
                            $(opt.left).animate(
                                {
                                    height: opt.scale
                                },
                                800,
                                () => {
                                    $(opt.left).animate(
                                        {
                                            height: opt.scalex
                                        },
                                        800,
                                        () => {
                                            $(opt.bottom).animate(
                                                {
                                                    width: opt.scalex
                                                },
                                                1000,
                                                () => {
                                                    $(opt.right).animate(
                                                        {
                                                            height: opt.scalex
                                                        },
                                                        800,
                                                        () => {
                                                            $(opt.top).animate(
                                                                {
                                                                    width: opt.scalex
                                                                },
                                                                1000,
                                                                () => {
                                                                    // this.animation("100%", "0%");
                                                                    // opt.cb && opt.cb()
                                                                    linear(opt)
                                                                }
                                                            );
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    );
}
export default linear